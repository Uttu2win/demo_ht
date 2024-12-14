import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import NotificationModel from '../models/Notification.js';

const router = express.Router();

// Get notifications for a user
router.get('/', protect, async (req, res) => {
  try {
    const { userId, days = 5 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const notifications = await NotificationModel.find({
      recipient: userId,
      createdAt: { $gte: cutoffDate }
    })
    .populate('actor', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching notifications', 
      error: error.message 
    });
  }
});

// Delete a notification
router.delete('/:notificationId', protect, async (req, res) => {
  try {
    const notification = await NotificationModel.findOneAndDelete({
      _id: req.params.notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting notification', 
      error: error.message 
    });
  }
});

export default router;