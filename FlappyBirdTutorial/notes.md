
### Serving A JS Game [1]:

Goal: Implement a leaderboard using ~paldev's %pals peer tracking agent. DIrectly server client code with Urbit as a server.
- Will maintain persistant state across sessions, or communicate between players at discrete intervals.
    - does NOT allow for direct PVP (!!)

- Necessary Components:
    - FE
    - Data Model: WE use structures and marks for this.
    - BE: Urbit serves a database for saving/propogating scores.
    - Communication protocol: We get the peers list from %pals.
        - vertical communciation: %flap-action mark.
        - horizontal communicaiton: %flap-update mark.

- we can't just use **fakezod galaxies** for this. We need a comet to get started. Boot one [here](https://urbit.org/getting-started/cli)

- A comet with three desks: %base, %garden and a merged %flap (from our %base) are mounted. We edit desk.bill with a %flap mark.
- Interestingly, we need to copy files form %base and %garden to make %flap work (simple merge wasn't good enough). Done with the following commands:

```
# Copy necessary %base files to %flap
cp -r comet/base/lib comet/flap
cp -r comet/base/sur comet/flap
cp -r comet/base/mar comet/flap

# Copy necessary %garden files to %flap
yes | cp -r comet/garden/lib comet/flap
yes | cp -r comet/garden/sur comet/flap
yes | cp -r comet/garden/mar comet/flap

# Create empty directories for planned files
mkdir -p comet/flap/app/flap
mkdir -p comet/flap/mar/flap

git clone https://github.com/hoon-school/schooner.git
cp schooner/lib/schooner.hoon comet/flap/lib
```

- FB Game copied from [this] repo. We only need inex.html and the .wav files, apparently.
- the actual FB Game directory itself is copied into /comet/%flap/app/flap. It all just lives in a nested folder.
- At this point, the files are on Mars, but are not hooked up to urbit. Clay doesn't know how to build and hook it up...
    - at minimum, we load and display the front-end using `/app/flap.hoon`.
- Our state for the game must track: current score, all-time high score (player), hi-score (other players).










### References:

[1]: https://developers.urbit.org/guides/additional/app-workbook/flap