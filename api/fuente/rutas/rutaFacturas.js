const { Router } = require('express');
const controller = require('../controladores/controladorFacturas');

const router = Router();

router.get('/', controller.get); // Ruta para obtener todas las facturas
router.get("/:id", controller.getById);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;