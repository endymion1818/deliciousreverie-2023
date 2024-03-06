export let title = 'Delicious Reverie';
export let subtitle = "Benjamin Read's code garden."
export let siteUrl = "https://deliciousreverie.co.uk"
export let siteLanguage = 'en-GB'

export let menuItems = [{
  title: 'Home',
  link: '/',
}, {
  title: 'About',
  link: '/about/',
}, {
  title: 'Links',
  link: '/links/',
}, {
  title: 'Articles',
  link: '/tags/',
}, {
  title: 'Contact',
  link: '/contact/',
}]

export let footerMenuItems = [{
  title: 'Links',
  items: [{
    title: 'JavaScript',
    link: '/tags/javascript/'
  }, {
    title: 'Engineering',
    link: '/tags/engineering/'
  },{
    title: 'Personal',
    link: '/tags/personal/'
  }]
}, {
  title: 'Menu',
  items: menuItems
}]

export let acknowledgementText = "Delicious Reverie is the blog of Benjamin Read. © Some rights are reserved."

export let socialLinks = {
  linkedin: {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/benjaminread1980/"
  },
  youtube: {
    title: "youtube",
    link: "https://www.youtube.com/channel/UCzbL3ZYvJWzJbrbHCgZLDJQ"
  },
  github: {
    title: "github",
    link: "https://github.com/endymion1818"
  },
  rss: {
    title: "RSS",
    link: "https://deliciousreverie.co.uk/rss.xml"
  }
}
