import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { Farmer } from '../models/models.js';
import { makeCrudController } from '../controllers/crud.controller.js';

const router = Router();
const ctrl = makeCrudController(Farmer);

router.use(authenticate);
router.get('/', authorize('admin'), ctrl.list);
router.post('/', authorize('admin'), ctrl.create);
router.get('/:id', authorize('admin', 'farmer'), ctrl.get);
router.put('/:id', authorize('admin'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

export default router;




