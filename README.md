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

#### Hints
* Add "Default sort attribute" `rank`, "Default sort order" `ASC` and remove the `rank` attribute from the view using "Configure the view" button.
* You can also set a `title` value that is displayed in the menu instead of the default.

### In your frontend
Assuming you go with the default settings, you can make a request on the following url to get the ordered items:

```
http://localhost:1337/api/foo?sort=rank:asc
```

## 🤝 Contribute
Feel free to fork and make pull requests to this plugin. All input is welcome - thanks for all contributions so far!
