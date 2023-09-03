"use client";

import { useState, MouseEvent, ChangeEvent } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useSearchParams } from 'next/navigation'

function MySaveButton({ title, target }: { title: string, target: string }) {
  return (
    <a title={title}
      href={target}
    >
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" title={title}>{title}</button>
    </a>
  );
}

function linkListToQueryParams(links: Array<string>) {
  var tmp = links.join('&v=')
  tmp = '?v=' + tmp
  return tmp
}

export default function Home() {
  var searchParams = useSearchParams()
  var [links, setLinks] = useState(searchParams.getAll("v").map((v) => atob(v)));
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
        <input id="newLink" placeholder="Enter new link" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
        <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add link</button>
    </div>);
  }

  function LinkList({ links }: { links: Array<string>}) {
    const linkItems = links.map((link) => <a href={link} key={uuidv4()} className="block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{link}<li key={uuidv4()}></li></a>)
    return (<ul>{linkItems}</ul>)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LinkList links={links}></LinkList>
      <AddLink></AddLink>
      <MySaveButton title='Save bookmarks' target={linkListToQueryParams(links.map((v) => encodeURIComponent(btoa(v))))}></MySaveButton>
    </main>
  )
}
