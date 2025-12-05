"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import  axiosInstance  from "@/lib/axiosInstance";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const t = useTranslations("favorites");
  const locale = useLocale();

  const fetchFavorites = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/user-favorite", {
        params: { limit: 10, page },
      });
      setFavorites(data?.data || []);
      setTotalPages(data?.totalPages || 1);
      setTotalData(data?.totalData || 0);
    } catch (err) {
      console.error(err);
      setFavorites([]);
      setTotalPages(1);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(page);
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 w-full">
      <h1 className="text-xl font-bold mb-6">{t("title")}</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <div className="text-red-500 text-5xl mb-4">❤</div>
          <p className="text-gray-600 mb-4">{t("emptyMessage")}</p>
          <button className="bg-[#0E766E] text-white px-6 py-2 rounded-lg hover:bg-[#095F59]">
            {t("exploreButton")}
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3">ID</th>
                  <th className="p-3">Cover</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((fav, index) => {
                  const facility = fav.facility;
                  const cover = facility?.cover
                    ? `/${locale}/api/media?media=${facility.cover}`
                    : null;
                  const name = facility?.name?.en || "—";
                  const description =
                    facility?.description?.en ||
                    facility?.overview?.en ||
                    "—";

                  return (
                    <tr
                      key={index}
                      className="border-b text-sm hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{facility?.id}</td>
                      <td className="p-3">
                        {cover ? (
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                            <Image
                              src={cover}
                              alt={name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No Photo</span>
                        )}
                      </td>
                      <td className="p-3">{name}</td>
                      <td className="p-3">{description}</td>
                      <td className="p-3">
                        <Link
                          href={`/userview/allFacilities/${facility?.id}`}
                          className="bg-[#0E766E] text-white px-4 py-1 rounded-lg hover:bg-[#095F59]"
                        >
                          Rent Now
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Circles فقط لو العدد أكبر من 10 */}
          {totalData > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
                    page === num
                      ? "bg-[#0E766E] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}