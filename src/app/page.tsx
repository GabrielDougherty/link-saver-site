"use client";

import { useState, MouseEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useSearchParams } from 'next/navigation'
import * as cheerio from 'cheerio'

function MySaveButton({ title, target }: { title: string, target: string } ) {
  return (
    <a title={title}
      href={target}
    >
    <button className="block mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" title={title}>{title}</button>
    </a>
  );
}

function linkListToQueryParams(links: Array<string>, defaultParamsOnError: string) {
  var tmp = links.join('&v=')
  tmp = tmp.length > 0 ? '?v=' + tmp : '#'
  if (tmp.length > 7000)
  {
    tmp = defaultParamsOnError;
  }
  console.log(tmp.length)
  return tmp
}

function encodeParamsArgs(links: Array<string>) {
  return links.map((v) => encodeURIComponent(btoa(v)))
}

function ModalErrorCancel({ contents, setState } : { contents: string, setState: Dispatch<SetStateAction<{ links: string[]; showModal: boolean; }>> }) {
  function handleClick() {
    setState((state) => {
      return {links: state.links, showModal: false}
    })
  }
  return (
  <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  {/* <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  --> */}
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
      {/* <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      --> */}
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Error</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{contents}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" onClick={handleClick} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>);
}

export default function Home() {
  var searchParams = useSearchParams()
  var [state, setState] = useState({
    links: searchParams.getAll("v").map((v) => atob(v)),
    showModal: false
  });
  function AddLink() {
    var newLink: string;
    newLink = '';
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      console.log('hello1')
      newLink = e.target.value;
    }

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
      console.log('hello2')
      console.log(state)
      setState((state) => {
        return {links: [...state.links, newLink], showModal: state.showModal}
      });
    }
    return (<div>
        <input id="newLink" placeholder="Enter new link" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
        <button onClick={handleClick} className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add link</button>
    </div>);
  }

  function LinkList({ links }: { links: Array<string>}) {
    const linkItems = links.map((link) => <a href={link} key={uuidv4()} className="block break-all flex-col bg-gray-200 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mb-2">{link.substring(0, 120)}<li key={uuidv4()}></li></a>)
    return (<ul className='mt-2'>{linkItems}</ul>)
  }

  function FormLabel({ contents }: {contents: string}) {
    return (
    <label className="block mt-2 text-gray-700 text-sm font-bold mb-2">
      {contents}
    </label>);
  }

  function BookmarksUpload() {
    function parseBookmarks(data: string) {
      var $ = cheerio.load(data);
      var newLinks = Array<string>()
      var showModal = state.showModal
      $("a").each(function(index, a) {
          var $a = $(a);
          var url = $a.attr("href");
          if (url) {
            newLinks.push(url!)
          }
          if (url && linkListToQueryParams(encodeParamsArgs([...state.links, ...newLinks]), "") == "") {
            console.log('skipping')
            newLinks.pop()
            showModal = true
            return true
          }
      });
      setState((state) => {
        return {links: [...state.links, ...newLinks], showModal: showModal}
      })
    }    
    async function onChange(e: ChangeEvent<HTMLInputElement>) {
      const text = await e.target.files?.item(0)?.text();
      if (text) {
        parseBookmarks(text!)
      }
    }
    return (
      <div className='block mt-2'>
        <FormLabel contents='Upload browser bookmarks file'></FormLabel>
        <input className='block mt-2' type="file" title='Upload' onChange={onChange}></input>
      </div>
    )
  }

  function encodeParams() {
    return state.links.map((v) => encodeURIComponent(btoa(v)))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    {state.showModal &&
      <ModalErrorCancel contents='Bookmark list too long. Truncating.' setState={setState}></ModalErrorCancel>
    }
      <div className='p-4 bg-gray-200 flex-col'>
        <h1 className='text-lg'>Link Saver</h1>
        <AddLink></AddLink>
        <BookmarksUpload></BookmarksUpload>
        <MySaveButton title='Get link to this list' target={linkListToQueryParams(encodeParams(), "")}></MySaveButton>
      </div>
      <LinkList links={state.links}></LinkList>
    </main>
  )
}
