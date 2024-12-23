// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FaGithub, FaLinkedin, FaInstagram, FaGamepad } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaGamepad className="text-2xl text-purple-500" />
              <span className="text-xl font-bold">GameVault</span>
            </div>
            <p className="text-gray-400">
              Your ultimate destination for gaming information. Powered by RAWG API,
              we provide comprehensive details about games, platforms, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-purple-500">Home</a></li>
              <li><a href="/categories" className="hover:text-purple-500">Categories</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://bit.ly/GitAntoDav" target='_blank' className="text-gray-400 hover:text-purple-500">
                <FaGithub size={24} />
              </a>
              <a href="https://bit.ly/LinkedinAntonio" target='_blank' className="text-gray-400 hover:text-purple-500">
                <FaLinkedin size={24} />
              </a>
              <a href="https://bit.ly/IgAntonio" target='_blank' className="text-gray-400 hover:text-purple-500">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ReHacktor. All rights reserved.</p>
          <p className="mt-2">Powered by AntoDav</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 