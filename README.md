<div align="center">
  <img src="https://user-images.githubusercontent.com/37687705/192227260-db082018-947a-4166-a3f4-983e1024dd59.png" width="20%">
  <h1>Strapi plugin drag-drop-content-types</h1>
</div>

![dragdropcrop](https://user-images.githubusercontent.com/37687705/212884821-356ec68c-b71a-4b89-9e99-8a625f84cfbe.gif)

## ⏳ Installation

```bash
# with npm
npm i @retikolo/drag-drop-content-types
# with yarn
yarn add @retikolo/drag-drop-content-types
```

## 🔧 Configuration

### In your config
1. Add this to your `config/plugins.js` file (create it, if it doesn't exist yet):
```js
module.exports = {
  // ...
  'drag-drop-content-types': {
    enabled: true
  }
}
```
2. Run `npm run build` and (re)start the app

### In the app
Go to `Settings` -> `Drag Drop Content Type` -> `Configuration`:
* Specify how the rank field is called in your content-types. Default value is `rank`.
* Add the `rank` fields to your content type. With the default value this would be `rank` (Number (Number format: integer)).
* (Give permissions for the `rank` field to roles such as "Editor" if needed).

#### Hints
* Add "Default sort attribute" `rank`, "Default sort order" `ASC` and remove the `rank` attribute from the view using "Configure the view" button.
* You can also set a `title` value that is displayed in the menu instead of the default.
* If you want a second field to be displayed in the drag and drop menu, you can add s `subtitle` in the settings. The subtitle should either be:
- A field containing a string or number or something like that.
- It can be an object (like a relation), but it must have the `title` field specified in the settings (it won't recognize automatically!).

### In your frontend
Assuming you go with the default settings, you can make a request on the following url to get the ordered items:

```
http://localhost:1337/api/foo?sort=rank:asc
```

## 🐞 Known issues
Due to changes in the Strapi core, the plugin causes a full page reload after sorting. This is a known issue, and will be fixed ASAP if possible.

## 🤝 Contribute
Feel free to fork and make pull requests to this plugin. All input is welcome - thanks for all contributions so far!


## ⭐️ Support
I you like this project, please give it a star. Maybe this will help it getting integrated to strapi's core some day 😊.