### Quoridor: On Urbit

For the Assembly Hackathon 2023, I will be attempting to make a basic implementation of Quoridor solo!

The goal is to code the app to will have the following minimum functionality:

    • A working implementation with two players only:
        ◦ User types in an @p, and initiates a game with another Quoridor client.
        ◦ Two Quoridor Apps talk to one another, sending move packets and taking turns. 
        ◦ Simple clay storage: Stores one current game, with a file of each players moves that must be kept in sync with the two clients.
            ▪ Single game Savestate kept in a file on desk.
        ◦ Front-end Javascript/HTML/CSS for UI, communicates via HTTP POST requests
            ▪ Array processing done on front-end side (not currently implemented in hoon standard library), for increased ease/speed of processing. 

If time permits, other features such as:
    - Saved games
    - A score board
    - Hooking up a Quoridor AI

Could be considered.