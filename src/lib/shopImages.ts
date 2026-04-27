import shopChest from "@/assets/shop-chest.jpg";
import shopPotion from "@/assets/shop-potion.jpg";
import shopSword from "@/assets/shop-sword.jpg";
import shopJewel from "@/assets/shop-jewel.jpg";
import shopPet from "@/assets/shop-pet.jpg";
import shopWings from "@/assets/shop-wings.jpg";

export const SHOP_IMAGE_MAP: Record<string, string> = {
  chest: shopChest,
  potion: shopPotion,
  sword: shopSword,
  jewel: shopJewel,
  pet: shopPet,
  wings: shopWings,
};

export const SHOP_IMAGE_KEYS = Object.keys(SHOP_IMAGE_MAP);

export function shopImageFor(key: string): string {
  return SHOP_IMAGE_MAP[key] ?? shopChest;
}
