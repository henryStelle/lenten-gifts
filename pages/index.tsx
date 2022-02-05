import { GetServerSideProps } from "next";

export default function Home() {
  return <p>The home page doesn't exist.</p>;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/view",
    permanent: false,
  },
});
