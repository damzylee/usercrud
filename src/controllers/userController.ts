import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role ?? "user",
    });

    res.status(201).json({ user });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;
  const { firstName, lastName, email, role } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.role = role;

    await user.save();

    res.status(200).json({ user });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
