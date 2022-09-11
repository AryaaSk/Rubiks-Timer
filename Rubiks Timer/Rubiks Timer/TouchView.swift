//
//  TouchView.swift
//  Native
//
//  Created by Aryaa Saravanakumar on 02/08/2022.
//

import Cocoa

class TouchView: NSView {
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        self.allowedTouchTypes = .indirect
        self.wantsRestingTouches = true
    }
    
    //https://stackoverflow.com/questions/3573276/know-the-position-of-the-finger-in-the-trackpad-under-mac-os-x
    override func touchesBegan(with event:NSEvent) {
        let touches = event.allTouches()
        for touch in touches {
            let position = touch.normalizedPosition
            let quadratPosition = CGPoint(x: (position.x - 0.5) * 2, y: (position.y - 0.5) * 2) //now ranges from -1 to 1 in x and y
            touchDown(position: quadratPosition)
            
            //let haptic = NSHapticFeedbackManager.defaultPerformer
            //haptic.perform(.levelChange, performanceTime: .default)
        }
    }
    
    override func touchesMoved(with event:NSEvent) {
        let touches = event.allTouches()
        for touch in touches {
            let position = touch.normalizedPosition
            let quadratPosition = CGPoint(x: (position.x - 0.5) * 2, y: (position.y - 0.5) * 2) //now ranges from -1 to 1 in x and y
            touchMoved(position: quadratPosition)
        }
    }
    
    override func touchesEnded(with event:NSEvent) {
        let touches = event.allTouches()
        for touch in touches {
            let position = touch.normalizedPosition
            let quadratPosition = CGPoint(x: (position.x - 0.5) * 2, y: (position.y - 0.5) * 2) //now ranges from -1 to 1 in x and y
            touchUp(position: quadratPosition)
        }
    }
    
    
    func touchDown(position: CGPoint) {
        NotificationCenter.default.post(name: NSNotification.Name("touchDown"), object: nil, userInfo: ["position" : position])
    }
    func touchMoved(position: CGPoint) {
        NotificationCenter.default.post(name: NSNotification.Name("touchMoved"), object: nil, userInfo: ["position" : position])
    }
    func touchUp(position: CGPoint) {
        NotificationCenter.default.post(name: NSNotification.Name("touchUp"), object: nil, userInfo: ["position" : position])
    }
}
