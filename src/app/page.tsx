"use client";

import Image from 'next/image'
import { useState } from 'react';

function MySaveButton({ title }: { title: string }) {
  return (
    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
    <a
      href="?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
    <button>{title}</button>
    </a>
  </div>
  );
}

function LinkList({ links }: { links: Array<string>}) {
    const linkItems = links.map((link) => <a href={link} key={link}>{link}<li key={link}></li></a>)
    return (<ul>{linkItems}</ul>)
}

export default function Home() {
  const [links, setLinks] = useState(["https://www.google.com/"]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LinkList links={links}></LinkList>
      <MySaveButton title='Save bookmarks'></MySaveButton>
    </main>
  )
}
