import db from "../config/config.js";
import bcrypt from "bcrypt";
import { generateId } from "../helpers/generateId.js";

export const User = {};

User.create = async (user) => {
  const hash = await bcrypt.hash(user.password, 10);

  const sql = `
    INSERT INTO users(
        name,
        lastname,
        email,
        password,
        phone,
        token,
        image_url,
        public_id_image,
        created_at,
        updated_at
    ) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING 
      name, 
      lastname, 
      email, 
      token`;

  return db.oneOrNone(sql, [
    user.name,
    user.lastname,
    user.email,
    hash,
    user.phone,
    generateId(),
    user.image_url,
    user.public_id_image,
    new Date(),
    new Date(),
  ]);
};

User.findByEmail = (email) => {
  const sql = `
      SELECT 
        id, 
        name, 
        lastname, 
        email,
        phone,
        password,
        confirmed,
        image_url 
      FROM 
        users 
      WHERE 
        email = $1`;

  return db.oneOrNone(sql, email);
};

User.findByPhone = (phone) => {
  const sql = `
      SELECT 
        id, 
        name, 
        lastname, 
        phone 
      FROM 
        users 
      WHERE 
        phone = $1`;

  return db.oneOrNone(sql, phone);
};

User.findByToken = (token) => {
  const sql = `
      SELECT 
        id, 
        token, 
        confirmed 
      FROM 
        users 
      WHERE 
        token = $1`;

  return db.oneOrNone(sql, token);
};

User.confirmToken = (id) => {
  const sql = `
    UPDATE 
        users
    SET 
        token = $2,
        confirmed = $3,
        updated_at = $4
    WHERE
        id = $1`;

  return db.none(sql, [id, null, true, new Date()]);
};

User.forgotPwd = (id) => {
  const sql = `
    UPDATE 
        users
    SET 
        token = $2,
        updated_at = $3
    WHERE
        id = $1     
    RETURNING name, lastname, token, email`;

  return db.oneOrNone(sql, [id, generateId(), new Date()]);
};

User.updatePassword = async (id, password) => {
  const hash = await bcrypt.hash(password, 10);

  const sql = `
    UPDATE 
        users
    SET 
        token = $2,
        password = $3,
        updated_at = $4
    WHERE
        id = $1`;

  return db.none(sql, [id, null, hash, new Date()]);
};

User.findById = async (id) => {
  const sql = `
      SELECT 
        id, 
        name, 
        lastname,
        email,
        password,
        phone,
        image_url,
        public_id_image
      FROM 
        users 
      WHERE 
        id = $1`;

  return db.oneOrNone(sql, id);
};

User.updateUserProfile = (id, user) => {
  const sql = `
  UPDATE 
      users
  SET 
      name = $2,
      lastname = $3,
      email = $4,
      phone = $5,
      image_url = $6,
      public_id_image = $7,
      updated_at = $8
  WHERE
       id = $1
  RETURNING 
      name,
      lastname,
      email,
      phone,
      image_url
  `;

  return db.oneOrNone(sql, [
    id,
    user.name,
    user.lastname,
    user.email,
    user.phone,
    user.secure_url,
    user.public_id,
    new Date(),
  ]);
};

User.updateProfileWithoutImage = (id, user) => {
  const sql = `
  UPDATE
      users
  SET
      name = $2,
      lastname = $3,
      email = $4,
      phone = $5,
      updated_at = $6
  WHERE
       id = $1
  RETURNING
      name,
      lastname,
      email,
      phone,
      image_url
  `;

  return db.oneOrNone(sql, [
    id,
    user.name,
    user.lastname,
    user.email,
    user.phone,
    new Date(),
  ]);
};

User.updatePasswordProfile = async (id, password) => {
  const hash = await bcrypt.hash(password, 10);

  const sql = `
    UPDATE 
        users
    SET 
        password = $2,
        updated_at = $3
    WHERE
        id = $1`;

  return db.none(sql, [id, hash, new Date()]);
};
