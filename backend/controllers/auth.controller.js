import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Farmer, Shop } from '../models/models.js';
import otpGenerator from 'otp-generator';

export async function register(req, res) {
  try {
    const { name, email, password, role, aadhar_number, phone, address, shop_name, location } = req.body;
    if (!['admin', 'farmer', 'shop'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: passwordHash, role });
    if (role === 'farmer') {
      await Farmer.create({ user_id: user.id, aadhar_number, phone, address });
    }
    if (role === 'shop') {
      await Shop.create({ user_id: user.id, name: shop_name, location });
    }
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    return res.status(500).json({ message: 'Registration failed', error: e.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, role: user.role, email: user.email, name: user.name } });
  } catch (e) {
    return res.status(500).json({ message: 'Login failed', error: e.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { aadhar, phone } = req.body;
    const farmer = await Farmer.findOne({ where: { aadhar_number: aadhar, phone: phone } });
    if (!farmer) return res.status(404).json({ message: 'User not found' });

    const user = await User.findOne({ where: { id: farmer.user_id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otp_expires_at = otpExpiresAt;
    await user.save();

    console.log(`OTP for user ${user.email}: ${otp}`);

    return res.status(200).json({ message: 'OTP sent to your registered phone number' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to send OTP', error: e.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { otp, password } = req.body;
    const user = await User.findOne({ where: { otp } });

    if (!user) return res.status(400).json({ message: 'Invalid OTP' });

    if (user.otp_expires_at < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    user.otp = null;
    user.otp_expires_at = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to reset password', error: e.message });
  }
}




