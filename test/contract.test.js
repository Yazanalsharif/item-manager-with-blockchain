const itemManager = artifacts.require("ItemManager");


contract("item Manager", accounts => {
    it("should let you create new Items", async () => {
        const itemManagerInstance = await itemManager.deployed();
        console.log(itemManager);
    })
})