"use client";

import { useState, MouseEvent, ChangeEvent } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useSearchParams } from 'next/navigation'

function MySaveButton({ title, target }: { title: string, target: string }) {
  return (
    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
    <a
      href={target}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
    <button title={title}>{title}</button>
    </a>
  </div>
  );
}

function linkListToQueryParams(links: Array<string>) {
  var tmp = links.join('&v=')
  tmp = '?v=' + tmp
  return tmp
}

export default function Home() {
  var searchParams = useSearchParams()
  var [links, setLinks] = useState(searchParams.getAll("v"));
  function AddLink() {
    var newLink: string;
    newLink = '';
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      console.log('hello1')
      newLink = e.target.value;
    }
    function handleClick(e: MouseEvent<HTMLButtonElement>) {
      console.log('hello2')
      console.log(links)
      setLinks((links) => [...links, newLink]);
    }
    return (<div>
        <input id="newLink" placeholder="Enter new link" onChange={handleChange}></input>
        <button onClick={handleClick}>Add link</button>
    </div>);
  }

  function LinkList({ links }: { links: Array<string>}) {
    const linkItems = links.map((link) => <a href={link} key={uuidv4()}>{link}<li key={uuidv4()}></li></a>)
    return (<ul>{linkItems}</ul>)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LinkList links={links}></LinkList>
      <AddLink></AddLink>
      <MySaveButton title='Save bookmarks' target={linkListToQueryParams(links)}></MySaveButton>
    </main>
  )
}
