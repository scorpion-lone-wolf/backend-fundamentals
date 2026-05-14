// Building a multi-threaded tcp server in Go
package main

import (
	"fmt"
	"net"
	"time"
)

// main function
func main() {
	listener,err := net.Listen("tcp", ":3000")
	if err != nil{
		fmt.Println("Connection Error :", err)
	}
	// ensure the listener is closed when the program exits
	defer listener.Close()

	fmt.Println("Server is listening on port 3000...")

	for{
		// blocking
		conn,err := listener.Accept() // This will block until a client connects
		fmt.Println("Code Execution moved...")
		if err != nil{
			fmt.Println("Connection Error :", err)
		}
		// handle the connection in a new goroutine (creating lightweight thread)
		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	// ensure the connection is closed when the function exits
	defer conn.Close()
	fmt.Println("New client connected:", conn.RemoteAddr())

	// Simulate some work
	time.Sleep(5 * time.Second)

	// send a welcome message to the client
	conn.Write([]byte("Hello from server!"))
}
