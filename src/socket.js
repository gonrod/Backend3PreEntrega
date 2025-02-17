const Product = require('./dao/models/Product');

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log('🔌 Cliente conectado:', socket.id);

        // Recibir y validar el rol del usuario
        socket.on('authenticate', (user) => {
            socket.user = user;
            console.log(`✅ Usuario autenticado: ${user.email} - Rol: ${user.role}`);
        });

        // Enviar lista de productos al conectar
        try {
            const products = await Product.find();
            socket.emit('productList', products);
        } catch (error) {
            console.error('❌ Error obteniendo productos de MongoDB:', error);
        }

        // SOLO ADMIN: Agregar un nuevo producto
        socket.on('newProduct', async (product) => {
            if (!socket.user || socket.user.role !== 'admin') {
                return socket.emit('error', '⚠ No tienes permisos para agregar productos.');
            }

            try {
                const newProduct = new Product(product);
                await newProduct.save();
                const products = await Product.find();
                io.emit('productList', products);
                console.log(`🛒 Producto añadido por ${socket.user.email}:`, product);
            } catch (error) {
                console.error('❌ Error agregando producto:', error);
            }
        });

        // SOLO ADMIN: Actualizar producto existente
        socket.on('updateProduct', async ({ productId, updates }) => {
            console.log("🛠 Verificando permisos en el socket para editar:", socket.user);
        
            if (!socket.user || socket.user.role !== 'admin') {
                return socket.emit('error', '⚠ No tienes permisos para actualizar productos.');
            }
        
            try {
                await Product.findByIdAndUpdate(productId, updates, { new: true }); // 🔥 Actualiza el producto en la base de datos
                const products = await Product.find();
                io.emit('productList', products); // 🔄 Envía la lista actualizada de productos a todos los clientes
                console.log(`✏ Producto actualizado por ${socket.user.email}:`, productId);
            } catch (error) {
                console.error('❌ Error actualizando producto:', error);
            }
        });
        

        // SOLO ADMIN: Eliminar producto
        socket.on('deleteProduct', async (productId) => {
            if (!socket.user || socket.user.role !== 'admin') {
                return socket.emit('error', '⚠ No tienes permisos para eliminar productos.');
            }

            try {
                await Product.findByIdAndDelete(productId);
                const products = await Product.find();
                io.emit('productList', products);
                console.log(`🗑 Producto eliminado por ${socket.user.email}:`, productId);
            } catch (error) {
                console.error('❌ Error eliminando producto:', error);
            }
        });
    });
};
