"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useTranslation } from "../../context/TranslationContext";
import Navigation from "../../components/Navigation";

export default function Dashboard() {
  const { t } = useTranslation();
  const username = useSelector((state: RootState) => state.user.name);
  const routes = useSelector((state: RootState) => state.routes.tomorrow);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold">
          {t("welcome")}, {username}!
        </h1>
        <h2 className="text-xl mt-4">{t("routesForTomorrow")}</h2>
        {routes.length > 0 ? (
          <table className="min-w-full mt-4">
            <thead>
              <tr>
                <th>{t("route")}</th>
                <th>{t("startTime")}</th>
                <th>{t("endTime")}</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr key={index}>
                  <td>{route.title}</td>
                  <td>{route.start}</td>
                  <td>{route.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4">{t("noRoutesForTomorrow")}</p>
        )}
      </div>
    </div>
  );
}
