import { Icon, IconProps } from "@iconify/react";
import { Box, BoxProps } from "@mui/material";

interface IconifyProps extends BoxProps {
  icon: IconProps["icon"];
  width?: number; // Ensure width is a number (not responsive values)
  height?: number; // Ensure height is a number (not responsive values)
}

const IconifyIcon = ({
  icon,
  width = 20,
  height = 20,
  sx,
  ...rest
}: IconifyProps) => {
  const baseStyles = {
    width,
    height,
    flexShrink: 0,
    display: "inline-flex",
  };

  return (
    <Box sx={{ ...baseStyles, ...sx }} {...rest}>
      <Icon icon={icon} width={width} height={height} />
    </Box>
  );
};

export default IconifyIcon;
