describe('Selenium Test Case', function() {
  it('should execute test case without errors', function() {
    var text, value, bool, source, url, title;
    var TestVars = {};
    element(by.linkText("Packet")).click();
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "Packets");
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "Packet Editor");
    element(by.xpath("//div[@class='col-md-2']/fg-list/div[1]/input")).sendKeys("a-new-packet");
    element(by.css("button.btn.btn-default")).click();
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "a-new-packet");
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "Ethernet");
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "Add");
    element(by.xpath("//div[@class='col-md-2']/fg-list/table/tbody/tr[1]/td/span")).click();
  });
});
