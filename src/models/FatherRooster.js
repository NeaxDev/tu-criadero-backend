import db from "../config/config.js";

export const FatherRooster = {};

FatherRooster.create = async (father, image_url, public_id_image) => {
  const sql = `
        INSERT 
            id_user,
            name,
            plate,
            type_crest,
            fights,
            description,
            is_bought,
            purchase_date,
            from_hatchery,
            birth_date,
            image_url,
            public_id_image,
            created_at,
            updated_at
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

  return db.oneOrNone(sql, [
    father.id_user,
    father.name,
    father.plate,
    father.type_crest,
    father.fights,
    father.description,
    father.is_bought,
    father.purchase_date,
    father.from_hatchery,
    father.birth_date,
    father.image_url,
    father.public_id_image,
    new Date(),
    new Date(),
  ]);
};
