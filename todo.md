## TODO

- [x] check if possible to delete updateConfiguration from Socketable mixin and use only config setter
- [x] qrCode events are emitted wrongly. Sometime it emit one value other times it emits more
- [x] refactored incorrect implementation for setting the config so, now, each plugin if it has not socketable, updates only local storage,
  on the contrary, with same methods, notifies also all updates automatically
- [ ] Objects and classes converted or coerced to strings should define a "toString()" method
- [ ] Handle sockets with multiple clients
- [ ] Handle telegram errors
- [ ] Check 2FA for telegram login
