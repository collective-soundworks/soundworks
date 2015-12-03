# Examples

This section presents a few *Soundworks*-based examples.

## Template

The template ([`soundworks-template`](https://github.com/collective-soundworks/soundworks-template)) provides a boilerplate to write a *Soundworks* application. In this scenario example, the players play a sound when they start the performance, and play another sound when other players join the performance.

This example is well documented in the code.

### Installation via the command line

To install the scenario and start the server, run:

```
git clone https://github.com/collective-soundworks/soundworks-template.git
cd soundworks-template
npm install
npm run bundle
```

### How to play?

Here are the different client types supported by the scenario:

- `'player'`: access `http://localhost:3000` from a mobile device.  
  This is the regular player who plays a sound when it starts the performance, and when another player joins the performance.

## Soundfield

Soundfield ([soundworks-soundfield](https://github.com/collective-soundworks/soundworks-soundfield)) allows a soloist to play sound (and light) on the smartphones of other players.
At the beginning of the performance, the players indicate their positions on a map: their positions appear on the soloist's screen.
Then, the soloist can move his / her finger on screen: the players under the finger emit sound and light in real time.

This example is well documented in the code.

### Installation via the command line

To install the scenario and start the server, run:

```
git clone https://github.com/collective-soundworks/soundworks-soundfield.git
cd soundworks-soundfield
npm install
npm run bundle
```

### How to play?

Here are the different client types supported by the scenario:

- `'player'`: access `http://localhost:3000` from a mobile device.  
  This is the regular player who emits sound and light when the soloist commands it.
- `'soloist'`: access `http://localhost:3000/soloist` from a mobile device (a tablet, if possible).  
  This is the client who can control light and sound on the smartphones of the players.

## Drops

The Drops collective smartphone performance ([soundworks-drops](https://github.com/collective-soundworks/soundworks-drops)) is strongly inspired by the mobile application Bloom by Brian Eno and and Peter Chilvers. Drops reproduces several audiovisual elements of the original Bloom application while transposing them into a collaborative experience.

In Drops, each participant can play sounds whose pitch and timbre vary depending on the touch position. Very similar to the Bloom application, each sound is visualized by a circle growing from the tapping position and fading with the sound.

Together, the players can construct sound sequences (i.e. melodies) by combining their sounds. The sounds are repeated in a fading loop every few seconds until they vanish. Players can clear the loop by shaking their smartphones. The sounds triggered by one player are automatically echoed by the smartphones of other players. The collective performance on the smartphones is accompanied by a synchronized soundscape on ambient loudspeakers.

### Installation via the command line

To install the scenario and start the server, run:

```
git clone https://github.com/collective-soundworks/soundworks-drops.git
cd soundworks-drops
npm install
npm run bundle
```

### How to play?

Here are the different client types supported by the scenario:
- `'player'`: access `http://localhost:3000` from a mobile device.  
  This is the regular player who can play drops and echo the other players' drops.
- `'conductor'`: access `http://localhost:3000/conductor` from a computer.  
  This is the control interface that allows to modify the parameters of the performance (such as the number drops a player has to play) in real time.
