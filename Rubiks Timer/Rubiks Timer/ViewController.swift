//
//  ViewController.swift
//  Native
//
//  Created by Aryaa Saravanakumar on 02/08/2022.
//

import Cocoa
import WebKit

class ViewController: NSViewController, WKUIDelegate, WKNavigationDelegate {
    
    @IBOutlet var webView: WKWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        webView.uiDelegate = self
        webView.navigationDelegate = self
        
        /*
         let url = "http://127.0.0.1:8080/Src"
         let request = URLRequest(url: URL(string: url)!)
         webView.load(request)
         */
        
        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "dist")!
        webView.loadFileURL(url, allowingReadAccessTo: url)
        let request = URLRequest(url: url)
        webView.load(request)
        
        NotificationCenter.default.addObserver(self, selector: #selector(touchDown), name: NSNotification.Name("touchDown"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(touchMoved), name: NSNotification.Name("touchMoved"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(touchUp), name: NSNotification.Name("touchUp"), object: nil)
    }
    
    override func viewDidAppear() {
        super.viewDidAppear()
        self.view.window?.title = "Rubiks Timer"
        //lockCursor()
    }
    
    func lockCursor() {
        NSCursor.hide()
        CGAssociateMouseAndMouseCursorPosition(0) //disconnects cursor from pointer position, effectively locking it on screen
        //self.view.window?.toggleFullScreen(self)
    }
    func unlockCursor() {
        NSCursor.unhide()
        CGAssociateMouseAndMouseCursorPosition(1)
    }
    
    @objc func touchDown(notification: NSNotification) {
        let position: CGPoint = notification.userInfo!["position"] as! CGPoint
        webView.evaluateJavaScript("TOUCH_DOWN(\(position.x), \(position.y));")
    }
    @objc func touchMoved(notification: NSNotification) {
        let position: CGPoint = notification.userInfo!["position"] as! CGPoint
        webView.evaluateJavaScript("TOUCH_MOVED(\(position.x), \(position.y));")
    }
    @objc func touchUp(notification: NSNotification) {
        let position: CGPoint = notification.userInfo!["position"] as! CGPoint
        webView.evaluateJavaScript("TOUCH_UP(\(position.x), \(position.y));")
    }
    
}

