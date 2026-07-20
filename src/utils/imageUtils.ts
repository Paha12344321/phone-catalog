export const getSafeImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  let cleanPath = imagePath.replace('api/', '').replace(/^\/+/, '').replace(/^\.\/+/ , '').replace(/^img\//, '');

  return `${import.meta.env.BASE_URL}img/${cleanPath}`;
};

export const normalizeProduct = (p: any) => ({
  ...p,
  id: String(p.id),
  itemId: String(p.itemId || p.id),
  fullPrice: p.fullPrice || p.priceRegular,
  price: p.price || p.priceDiscount,
  image: getSafeImageUrl(p.images && p.images.length > 0 ? p.images[0] : (p.image || p.imageUrl || '')),
  year: p.year || 0,
});
