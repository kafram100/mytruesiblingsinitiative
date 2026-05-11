import Image from "next/image";

export const BRAND_LOGO_SRC = "/nav-logo.png";
/** File on disk: `public/nav-logo.png` (navbar-only lockup). Must match real pixels for layout width. */
export const BRAND_LOGO_DIMENSIONS = { width: 1227, height: 331 } as const;
/** Responsive width hint for next/image (~32–40px-tall toolbar lockups). */
export const BRAND_LOGO_SIZES =
  "(max-width: 768px) 96px, (max-width: 1200px) 118px, 140px";

/**
 * Navbar logo: height-led scale (professional bar standard ~28–36px usable height).
 */
export const BRAND_LOGO_CLASS =
  "h-7 w-auto max-w-full object-contain object-left sm:h-8 md:h-8 lg:h-9 xl:h-9";

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogoImage({
  className,
  priority,
}: BrandLogoImageProps) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt="My True Siblings Initiative"
      width={BRAND_LOGO_DIMENSIONS.width}
      height={BRAND_LOGO_DIMENSIONS.height}
      sizes={BRAND_LOGO_SIZES}
      priority={priority}
      className={className}
      suppressHydrationWarning
    />
  );
}
