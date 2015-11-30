# Presentation

[*Soundworks*](https://github.com/collective-soundworks/soundworks) is a Javascript framework that enables artists and developers to create collaborative music performances where a group of participants distributed in space use their mobile devices to generate sound and light through touch and motion.

The framework is based on a client/server architecture supported by Node.js and WebSockets, and uses a modular design to make it easy to implement different performance scenarios: the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) allows anyone to bootstrap a scenario based on *Soundworks* and focus on its audiovisual and interaction design instead of the infrastructure.

## Before getting started…

Make sure that:
- Node `0.12.7` is installed on your system (the [`n`](https://github.com/tj/n) library allows you to switch easily between node versions);
- npm `3.3.12^` is installed on your system.

## … go!

If you want to hack in right away, your best bet is to go straight to the [`soundworks-template`](https://github.com/collective-soundworks/soundworks-template) repository.
Additionally, you'll find a few scenario examples in the [Collective Soundworks](https://github.com/collective-soundworks) organization, such as [*Soundfield*](https://github.com/collective-soundworks/soundworks-soundfield), [*Beats*](https://github.com/collective-soundworks/soundworks-beats), or [*Drops*](https://github.com/collective-soundworks/soundworks-drops).
Don't hesitate to have a look at them!

Otherwise, let's deep dive into this documentation…

# Authors

- [Sébastien Robaszkiewicz](mailto:hello@robi.me)
- [Norbert Schnell](mailto:Nobert.Schnell@ircam.fr)
- [Benjamin Matuszewski](mailto:Benjamin.Matuszewski@ircam.fr)
- [Jean-Philippe Lambert](mailto:Jean-Philippe.Lambert@ircam.fr)

# License

Copyright (c) 2014, IRCAM (France, Paris)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the IRCAM nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
