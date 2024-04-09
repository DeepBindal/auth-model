"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

function NavBar() {
  const { data: session } = useSession();

  const [toggleDrop, setToggleDrop] = useState(false);

  return (
    <nav className="flex-between w-full mb-16 pt-3 p-4">
      <Link href="/" className="flex-center flex gap-4">
        <Image
          src="/assets/logo.svg"
          width={30}
          height={30}
          alt="Logo"
          className="object-contain"
        />
        <p className="logo_text">Your logo</p>
      </Link>

      {/* Desktop Navigation  */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Any_Action
            </Link>
            <button
              type="button"
              className="outline_btn"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                src={session?.user.image || `/assets/user.svg`}
                className="rounded-full"
                width={37}
                alt="profile-pic"
                height={47}
                onClick={() => {
                  setToggleDrop((prev) => !prev);
                }}
              />
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              className="black_btn"
              onClick={() => {
                signIn();
              }}
            >
              Sign In
            </button>
            <Link href="/auth/signup" className="black_btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image || `/assets/user.svg`}
              className="rounded-full"
              width={37}
              alt="profile-pic"
              height={37}
              onClick={() => {
                setToggleDrop((prev) => !prev);
              }}
            />
            {toggleDrop && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDrop(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDrop(false)}
                >
                  Any_Action
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setToggleDrop(false);
                    signOut();
                  }}
                  className="mt-5 black_btn w-full"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {
              <button
                type="button"
                className="black_btn"
                onClick={() => {
                  signIn();
                }}
              >
                Sign In
              </button>
            }
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
