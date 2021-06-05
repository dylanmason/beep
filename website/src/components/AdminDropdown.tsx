import { SettingsIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react"
import React from "react";
import { Link } from 'react-router-dom';

export function AdminDropdown() {
  return (
    <Menu>
      <Button
        leftIcon={<SettingsIcon />}
        as={MenuButton}
        variant='solid'
        colorScheme="brand"
        color="white"
        size='md'
        mr={4}
      >
        Admin
      </Button>
      <MenuList>
        <MenuItem as={Link} to="/admin/users">
          Users
        </MenuItem>
        <MenuItem as={Link} to="/admin/beepers">
          Beepers
        </MenuItem>
        <MenuItem as={Link} to="/admin/beeps">
          Beeps
        </MenuItem>
        <MenuItem as={Link} to="/admin/reports">
          Reports
        </MenuItem>
        <MenuItem as={Link} to="/admin/ratings">
          Ratings
        </MenuItem>
      </MenuList>
    </Menu>
  );
}