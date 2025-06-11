export function get(url, callback, onError) {
    fetch(url)
        .then(it => callback(it))
        .catch(error => {
            if (onError) {
                onError(error)
            } else {
                console.error(error)
            }
        })
}