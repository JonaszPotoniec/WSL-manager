# WSL Manager
#### An easy way to manage your multiple linux subsystems
  
For now my app lets you delete or set as default any installed instance of WSL
![App screenshot](docs/img/app.png)

It supports extremally useful icon in notification area which lets you set your default distribution without opening an app
![Tray screenshot](docs/img/tray.png)

All you need to do is download latest [release](https://github.com/JonaszPotoniec/WSL-manager/releases).
It doesn't require installation nor admin rights.

### Settings

#### Settings are stored in config.json and can be edited via in-app menu

| Setting         | Description |
|-----------------|-------------|
| Close to tray   | Define if app should be closed or minimized to tray after clicking close button |
| Debug mode      | Turns on debug mode |
| Search interval | As default, distibution list only refreshes after changes like deleting or changing default. With this option you can set time in which list will be updated. It's useful if you are changing distributions frequently |

***

### Debug mode
> This is still work in progress and requires more work.
#### Debug mode gives you access to the console.

  
| Setting           | Description |
|-------------------|-------------|
| updateList()      | Forces refresh. Can be also done with a button |
| getDistroList()   | Gives list of found distributions |
| refreshTrayIcon() | Refreshes tray icon |

Debug mode commands will be improved in the future commits
