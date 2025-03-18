"use client";
// This is a client component
import { redirect } from 'next/navigation';
export const metadata = {
  title: "Hola Mundo",
};
export async function getServerSideProps() {
  redirect('/templates');
  return { props: {} };
}