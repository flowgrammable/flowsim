describe('Selenium Test Case', function() {
  it('should execute test case without errors', function() {
    var text, value, bool, source, url, title;
    var TestVars = {};
    element(by.linkText("Packet")).click();
    element(by.xpath("//div[@class='col-md-2']/fg-list/div[1]/input")).sendKeys("a");
    element(by.css("button.btn.btn-default")).click();
    element(by.xpath("//div[@class='col-md-2']/fg-list/div[1]/input")).sendKeys("ab");
    element(by.css("button.btn.btn-default")).click();
    // TODO: setElementSelected: "//div/div[2]/div/div[3]/fg-packet/div/div/select//option[2]"    element(by.css("div > div.input-group > span.input-group-btn > button.btn.btn-default")).click();
    element(by.css("tr.ng-scope.info > td.ng-binding")).click();
    element(by.css("td.ng-binding")).click();
    element(by.xpath("//div[@class='col-md-2']/fg-list/table/tbody/tr[1]/td/span")).click();
    // TODO: setElementSelected: "//div/div[2]/div/div[3]/fg-packet/div/div/select//option[3]"    element(by.css("div > div.input-group > span.input-group-btn > button.btn.btn-default")).click();
  });
});
