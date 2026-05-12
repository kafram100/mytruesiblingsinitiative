import Image from "next/image";

export const BRAND_LOGO_SRC = "/nav-logo.png";
/** File on disk: `public/nav-logo.png` (cleaned shared brand lockup). */
export const BRAND_LOGO_DIMENSIONS = { width: 1200, height: 654 } as const;
/** Responsive width hint for the updated, taller logo treatment. */
export const BRAND_LOGO_SIZES =
  "(max-width: 768px) 60px, (max-width: 1200px) 74px, 83px";

/**
 * Navbar logo: slightly taller so the cleaned mark stays legible in the header.
 */
export const BRAND_LOGO_CLASS =
  "h-8 w-auto max-w-full object-contain object-left sm:h-9 md:h-10 lg:h-10 xl:h-11";

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
      alt="My True Siblings logo"
      width={BRAND_LOGO_DIMENSIONS.width}
      height={BRAND_LOGO_DIMENSIONS.height}
      sizes={BRAND_LOGO_SIZES}
      priority={priority}
      className={className}
      suppressHydrationWarning
    />
  );
}
