"use client";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ActivityLogButton } from "./ActivityLog";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const locale = useLocale();

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl jordanian-border"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer hover:!text-secondary-300 transition-colors"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 bg-secondary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">ع</span>
              </div>

              <div className="flex flex-col">
                <div className="text-xl font-bold tracking-wider flex items-center gap-2">
                  {locale === 'ar' ? (
                    <>
                      <span className="arabic-font text-2xl">عقار</span>
                      <span className="text-xs text-secondary-300">AQAR</span>
                    </>
                  ) : (
                    <>
                      <span className="english-font">AQAR</span>
                      <span className="text-xs text-secondary-300 arabic-font">عقار</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="md:ml-4 bg-secondary-600 text-white hover:bg-secondary-700 border border-secondary-500"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">{t("addNewProperty")}</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:block ml-2">
                    {t("searchProperties")}
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isDashboardPage && (
          <p className="text-secondary-300 hidden md:block text-sm italic">
            {t("tagline")}
          </p>
        )}
        <div className="flex  items-center gap-5">
          <LanguageSwitcher currentLocale={locale} />
          {authUser ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="w-6 h-6 cursor-pointer text-secondary-300 hover:text-secondary-100 transition-colors" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-600 rounded-full"></span>
              </div>
              <div className="hidden md:block">
                <ActivityLogButton />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar className="border-2 border-secondary-500">
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="bg-secondary-600 text-white">
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-white hidden md:block font-medium">
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-900 border-secondary-300">
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-secondary-600 hover:!text-white font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        { scroll: false }
                      )
                    }
                  >
                    {t("goToDashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-secondary-300" />
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-secondary-600 hover:!text-white"
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        { scroll: false }
                      )
                    }
                  >
                    {t("settings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-secondary-600 hover:!text-white"
                    onClick={handleSignOut}
                  >
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-2 border-secondary-500 bg-transparent hover:bg-secondary-600 hover:border-secondary-600 rounded-lg transition-all"
                >
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-secondary-700 border-2 border-secondary-600 rounded-lg transition-all"
                >
                  {t("signUp")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
