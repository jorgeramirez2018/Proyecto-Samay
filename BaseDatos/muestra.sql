USE samay;

/*----------------------------------------------------------
  USUARIOS  (5)
----------------------------------------------------------*/
INSERT INTO usuario (nombre, contraseña, correo, telefono, rol) VALUES
  ('Juan Martínez', 'juan123', 'juan@example.com', '3000000001', 'cliente'),
  ('Verónica Cárdenas', 'vero123', 'veronica@example.com', '3000000002', 'cliente'),
  ('Jorge Ramírez', 'jorge123', 'jorge@example.com', '3000000003', 'cliente'),
  ('Alejandro García', 'ale123', 'alejandro@example.com', '3000000004', 'cliente'),
  ('Ángela Cultid', 'angela123', 'angela@example.com', '3000000005', 'cliente');

/*----------------------------------------------------------
  PRODUCTOS  (5)
----------------------------------------------------------*/
INSERT INTO producto
  (producto_id, nombre, comunidad, region, descripcion, stock, foto)
VALUES
  (1, 'Manilla', 'Quimbaya', 'Quindio',
     'Manilla hecha a mano, con varios tejidos entrelazados', 50,
     '/home/recursos/Manilla-tejida-a-mano-celeste.jpg'),

  (2, 'Chaleco', 'Muiscas', 'Andina',
     'Chaleco con flecos beige y cuentas. Clara representación de la vestimenta indígena andina',
     50, 'https://i.pinimg.com/736x/30/b6/93/30b69382e2c7a6199523bc79563e1b91.jpg'),

  (3, 'Móvil de Gallina Negra', 'Artesanos', 'Cundinamarca',
     'Móvil de Gallina elaborado por manos artesanas con tela y tagua en Bogotá.',
     50, 'https://artesaniasdecolombia.com.co/Documentos/Catalogo/36149_15-03-013-c-(5).jpg'),

  (4, 'Abanico en palma de Iraca', 'Artesanos', 'Nariño',
     'Abanico tejido en palma de iraca fina, varios colores. Hecho a mano en Nariño.',
     50, 'https://i.pinimg.com/736x/d3/e7/66/d3e766a29ac357772c21d26d51229d97.jpg'),

  (5, 'Contenedor Iraca Tapa Morado', 'Artesanos', 'Nariño',
     'Contenedor elaborado a mano con palma de iraca en Nariño.',
     50, 'https://artesaniasdecolombia.com.co/Documentos/Catalogo/36155_02-01-030-b-(3).jpg');

/*----------------------------------------------------------
  VENTAS  (5)
----------------------------------------------------------*/
INSERT INTO venta (venta_id, fecha_venta, total, usuario_id) VALUES
  (1, '2025-05-26 09:00:00',  50000.00, 1),  -- Juan compra Manilla
  (2, '2025-05-26 10:00:00',  60000.00, 2),  -- Verónica compra Chaleco
  (3, '2025-05-26 11:00:00',  25000.00, 3),  -- Jorge compra Móvil
  (4, '2025-05-26 12:00:00',  45000.00, 4),  -- Alejandro compra Abanico
  (5, '2025-05-26 13:00:00',  60000.00, 5);  -- Ángela compra Contenedor

/*----------------------------------------------------------
  VENTA_PRODUCTO  (5)
----------------------------------------------------------*/
INSERT INTO venta_producto
  (venta_id, producto_id, precio_unitario, cantidad)
VALUES
  (1, 1, 50000.00, 1),
  (2, 2, 60000.00, 1),
  (3, 3, 25000.00, 1),
  (4, 4, 45000.00, 1),
  (5, 5, 60000.00, 1);
