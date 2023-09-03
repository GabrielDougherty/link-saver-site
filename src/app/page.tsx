"use client";

import { useState, MouseEvent, ChangeEvent } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useSearchParams } from 'next/navigation'
import * as cheerio from 'cheerio'

function MySaveButton({ title, target }: { title: string, target: string }) {
  return (
    <a title={title}
      href={target}
    >
    <button className="block mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" title={title}>{title}</button>
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
        <button onClick={handleClick} className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add link</button>
    </div>);
  }

  function LinkList({ links }: { links: Array<string>}) {
    const linkItems = links.map((link) => <a href={link} key={uuidv4()} className="block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{link.substring(0, 120)}<li key={uuidv4()}></li></a>)
    return (<ul>{linkItems}</ul>)
  }

  function BookmarksUpload() {
    function parseBookmarks(data: string) {
      var $ = cheerio.load(data);
      $("a").each(function(index, a) {
          var $a = $(a);
          var url = $a.attr("href");
          if (url) {
            setLinks((links) => [...links, url!])
          }
      });
    }    
    async function onChange(e: ChangeEvent<HTMLInputElement>) {
      if (e.target.files != null) {
        const text = await e.target.files.item(0)?.text();
        if (text) {
          parseBookmarks(text!)
        }
      }
    }
    return (
      <div className='block mt-2'>
        <label className="block mt-2 text-gray-700 text-sm font-bold mb-2">
        Upload browser bookmarks file
        </label>
        <input className='block mt-2' type="file" title='Upload' onChange={onChange}></input>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='p-4 bg-gray-200'>
        <AddLink></AddLink>
        <BookmarksUpload></BookmarksUpload>
        <MySaveButton title='Save bookmarks' target={linkListToQueryParams(links.map((v) => encodeURIComponent(btoa(v))))}></MySaveButton>
      </div>
      <LinkList links={links}></LinkList>
    </main>
  )
}
