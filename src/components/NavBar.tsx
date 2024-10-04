"use client";

import { useSelector } from 'react-redux';
import { RootState } from '../app/redux/store';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import SelectLanguage from '@/components/UI/SelectLanguage/SelectLanguage';

const NavbarContainer = styled.nav`
  background-color: #343a40;
  padding: 1rem;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #fff;
  background-color: #007bff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 0.875rem;
  margin-right: 0.5rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignoutButton = styled.button`
  color: #fff;
  background-color: #dc3545;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;

  &:hover {
    background-color: #c82333;
  }
`;

const Navbar = () => {
  const { data: session } = useSession();
  const traduction = useTranslations('Navbar');

  // Obtenemos los productos del carrito desde Redux
  const cartItems = useSelector((state: RootState) => state.cart.products);

  return (
    <NavbarContainer>
      <Container>
        <NavLink href="/">{traduction('home')}</NavLink>
        <NavLink href="/cart">🛒 Carrito ({cartItems.length})</NavLink>
        {session?.user ? (
          <>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <SignoutButton onClick={() => signOut()}>Signout</SignoutButton>
            <SelectLanguage />
          </>
        ) : (
          <>
            <NavLink href="/login">{traduction('login')}</NavLink>
            <NavLink href="/register">{traduction('register')}</NavLink>
            <SelectLanguage />
          </>
        )}
      </Container>
    </NavbarContainer>
  );
};

export default Navbar;
