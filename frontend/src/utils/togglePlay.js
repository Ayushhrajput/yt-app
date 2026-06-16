const toggleVideoPlay = (ref) => {
    if(ref.current.paused) {
        ref.current.play()
    } else {
        ref.current.pause()
    }
}
export {
    toggleVideoPlay
}