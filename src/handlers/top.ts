import models from "../models";

// select
const tst = async () => {
  const rows = await models.UserFavoriteShops.findAll({
    attributes: ["user_id", "shop_category"],
  });
  rows.forEach((row) => {
    const user_id = row.user_id;
    const shop_category = row.shop_category;

    console.log(user_id, shop_category);
    // return { user_id, shop_category };
  });
};

tst;
console.log(tst);

// });
// console.log(userFavoriteShops.user_id);

// const categories = userFavoriteShops;

const categories = ["飲食", "美容"];
// const username = [""];

export const renderTopPage = (req: any, res: any) => {
  res.render("top", { categories: categories });
};
