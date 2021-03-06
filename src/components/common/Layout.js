import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link, StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

import { Navigation } from '.'
// import config from '../../utils/siteConfig'
// import config from '../../utils/siteConfig'

// Styles
// import '../../styles/app.css'
import '../../styles/app.scss'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
const DefaultLayout = ({ data, children }) => {
    let websiteTheme = `light`
    if (typeof window !== `undefined`) {
        websiteTheme = window.__theme
    }
    
    const [theme, setTheme] = useState(websiteTheme)
    
    const site = data.allGhostSettings.edges[0].node
    const twitterUrl = site.twitter ? `https://twitter.com/${site.twitter.replace(/^@/, ``)}` : null
    useEffect(() => {
        setTheme(window.__theme)
        window.__onThemeChange = () => {
            setTheme(window.__theme)
        }
    }, [])

    return (
        <>
            <Helmet>
                <html lang={site.lang} />
                <style type="text/css">{`${site.codeinjection_styles}`}</style>
                <body/>
            </Helmet>

            <div className="viewport">

                <div className="viewport-top">
                    {/* The main header section on top of the screen */}
                    <header className="site-head">
                        <div className="container">
                            <div className="site-mast">
                                <div className="site-mast-left">
                                    <Link to="/">
                                        {site.logo ?
                                            <div className="site-header-brand">
                                                <h1>{site.title}</h1>
                                                <p>{site.description}</p>
                                            </div>
                                            : <Img fixed={data.file.childImageSharp.fixed} alt={site.title} />
                                        }
                                    </Link>
                                </div>
                                <div className="dark-mode">
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        id="checkbox"
                                        onChange={() => {
                                            window.__setPreferredTheme(
                                                theme === `dark`
                                                    ? `light`
                                                    : `dark`
                                            )
                                        }}
                                        checked={theme === `light`}
                                    ></input>
                                    <label
                                        className="switch"
                                        htmlFor="checkbox"
                                    >
                                    </label>
                                </div>
                                <div className="site-mast-right">
                                    { site.twitter && <a href={ twitterUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer"><img className="site-nav-icon" src={theme === `light` ? `/images/icons/twitter-dark.png` : `/images/icons/twitter.svg`} alt="Twitter - Beto Toro"/></a>}
                                    <a className="site-nav-item" href="https://www.linkedin.com/in/beto-toro-859b811a6/" target="_blank" rel="noopener noreferrer"><img className="site-nav-icon" src={theme === `light` ? `/images/icons/linkedin-dark.png` : `/images/icons/linkedin.svg`} alt="Beto Toro - linkedin" /></a>
                                    <a className="site-nav-item" href="https://github.com/beto-toro" target="_blank" rel="noopener noreferrer"><img className="site-nav-icon" src={theme === `light` ? `/images/icons/github-dark.png` : `/images/icons/github.svg`} alt="Beto Toro - github" /></a>
                                </div>
                            </div>

                            <nav className="site-nav">
                                <div className="site-nav-left">
                                    {/* The navigation items as setup in Ghost */}
                                    <Navigation data={site.navigation} navClass="site-nav-item" />
                                </div>
                                <div className="site-nav-right">
                                    <Link className="site-nav-button" to="/author/betotoro">Sobre mí</Link>
                                </div>
                            </nav>
                        </div>
                    </header>

                    <main className="site-main">
                        {/* All the main content gets inserted here, index.js, post.js */}
                        {children}
                    </main>

                </div>

                <div className="viewport-bottom">
                    {/* The footer at the very bottom of the screen */}
                    <footer className="site-foot">
                        <div className="site-foot-nav container">
                            <div className="site-foot-nav-left">
                                Hecho con 💚 por <a className="site-foot-nav-item" href="https://ghost.org" target="_blank" rel="noopener noreferrer">Beto Toro</a> © 2020
                            </div>
                            <div className="site-foot-nav-right">
                                <Navigation data={site.navigation} navClass="site-foot-nav-item" />
                            </div>
                        </div>
                    </footer>

                </div>
            </div>

        </>
    )
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
    bodyClass: PropTypes.string,
    isHome: PropTypes.bool,
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
}

const DefaultLayoutSettingsQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettings {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                file(relativePath: {eq: "ghost-icon.png"}) {
                    childImageSharp {
                        fixed(width: 30, height: 30) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
            }
        `}
        render={data => <DefaultLayout data={data} {...props} />}
    />
)

export default DefaultLayoutSettingsQuery
