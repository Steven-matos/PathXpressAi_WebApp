import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import store from "../store/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Route Scheduler",
  description: "Schedule your routes and jobs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
