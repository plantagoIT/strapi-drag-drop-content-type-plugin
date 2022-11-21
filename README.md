<div align="center">
  <img src="https://user-images.githubusercontent.com/37687705/192227260-db082018-947a-4166-a3f4-983e1024dd59.png" width="20%">
  <h1>Strapi plugin drag-drop-content-types</h1>
</div>

![drag-drop-preview](https://user-images.githubusercontent.com/37687705/191790500-f7bc7968-cf10-4448-a049-3350d96d2d8b.png)

## ⚠ Important
This plugin might NOT behave like you expect. Since Strapi does not allow to fully access all page components, the content itself cannot be drag-and-dropped. Instead this plugin adds a panel, which allow sort content via drag-and-drop. This is not a very intuitive way, but might be better than nothing...

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
* Specify how the rank field and the corresponding title field are called in your content types. Default value are `rank` and `title`.
* Add the specified fields to your content type. With the default values this would be `title` (Text (Type: Short Text)) and `rank` (Number (Number format: integer)) 
* You will be rewared with the drag-dropable menu in the list view of all content types having the specified fields.
* (Recommendation: Add "Default sort attribute" `rank`, "Default sort order" `ASC` and remove the `rank` attribute from the view using "Configure the view" button.)

### In your frontend
Assuming you go with the default settings, you can make a request on the following url to get the ordered items:

```
http://localhost:1337/api/foo?sort=rank:asc
```

## 🤝 Contribute
Feel free to fork and make pull requests to this plugin. All input is welcome!
