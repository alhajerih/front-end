import React, { MouseEvent, useState } from "react";
import { StaticImageData } from "next/image";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import IconifyIcon from "./base/IconifyIcon";
import { logout } from "@/app/api/actions/auth";

/* ------------------------Profile dropdown Data --------------------------- */
const profileData = [
  {
    href: "#!",
    title: "My Profile",
    subtitle: "Account Settings",
    icon: "fa:user-circle-o",
    color: "primary.light",
  },
];
/* -------------------------------------------------------------------------- */

interface ProfileDropdownProps {
  profileImage: string | StaticImageData;
  userName: string;
  userRole: string;
  userEmail: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  profileImage,
  userName,
  userRole,
  userEmail,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenDropdown = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const imageSrc =
    typeof profileImage === "string" ? profileImage : profileImage.src;

  return (
    <React.Fragment>
      <IconButton
        sx={{ p: 0, position: "relative" }}
        onClick={handleOpenDropdown}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        aria-controls={Boolean(anchorEl) ? "profile-menu" : undefined}
      >
        <Avatar
          alt={userName}
          src={imageSrc}
          slotProps={{
            img: {
              sx: {
                objectFit: "cover",
              },
            },
          }}
          sx={{
            width: { xs: 40, md: 45, xl: 60 },
            height: { xs: 40, md: 45, xl: 60 },
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.2)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 0 0 6px rgba(25, 118, 210, 0.3)",
            },
          }}
        />
      </IconButton>
      {/* Profile Menu Dropdown*/}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{ horizontal: "left", vertical: "center" }}
        sx={{
          "& .MuiMenu-paper": {
            width: 280,
            bgcolor: "common.white",
          },
        }}
      >
        <Box p={3}>
          <Typography variant="subtitle1" color="text.primary">
            User Profile
          </Typography>
          <Stack direction="row" py={2.5} spacing={1.5} alignItems="center">
            <Avatar
              src={imageSrc}
              alt={userName}
              sx={{
                width: 65,
                height: 65,
                border: "2px solid",
                borderColor: "primary.main",
                boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.2)",
              }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                color="text.primary"
                fontWeight={600}
              >
                Name: {userName}
              </Typography>
              {/* <Typography variant="caption" color="textSecondary">
                {userRole}
              </Typography> */}
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <IconifyIcon icon="majesticons:mail-line" />
                {userEmail}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          {profileData.map((profileItem) => (
            <Box key={profileItem.title} sx={{ py: 1.5, px: 0 }}>
              <Link href={profileItem.href}>
                <Stack direction="row" spacing={1.5}>
                  <Stack
                    direction="row"
                    sx={{
                      width: 45,
                      height: 45,
                      bgcolor: "neutral.light",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1.5,
                    }}
                  >
                    {/* <Avatar
                      variant="rounded"
                      sx={{
                        minWidth: 24,
                        height: 24,
                        bgcolor: "transparent",
                      }}
                    >
                      <IconifyIcon
                        icon={profileItem.icon}
                        color={profileItem.color}
                      />
                    </Avatar> */}
                  </Stack>
                  <div>
                    {/* <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      noWrap
                      sx={{
                        width: 150,
                      }}
                    >
                      {profileItem.title}
                    </Typography> */}
                    {/* <Typography
                      variant="subtitle2"
                      sx={{
                        width: 150,
                      }}
                      noWrap
                    >
                      {profileItem.subtitle}
                    </Typography> */}
                  </div>
                </Stack>
              </Link>
            </Box>
          ))}
          <Box mt={1.25}>
            <Button onClick={logout} variant="outlined" color="error" fullWidth>
              Logout
            </Button>
          </Box>
        </Box>
      </Menu>
    </React.Fragment>
  );
};

export default ProfileDropdown;
