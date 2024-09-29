# FlashFile
A specification for a FlashInvader exchange format


The street artist known as **Invader** disposes mosaics originaly inspired by 8 bit videogames all over the world.
The mosaics can be *flashed* and collected in a smartphone application called FlashInvaders.

It is currently not possible to exchange or export the flashed mosaic list

The FlashFile format is a compact format to describe lists of items that can be Invader's mosaics.



# Specification

## Items
The format describes a list of items.
Each item has a unique name in the LOCATION_ORDER format.

Example : ```NY_100``` ```PA_27``` ```PA_1500```, ```SPACE_02```


## Format 
The format is text based and consists of a list of token, separated by spaces or newlines.
There can be comments starting from position 0 in a line or within a line provided all tokens in the line are valid.
Comments start with a ```#```  and the line content after does not contribute to tokens 
Tokens are case sensistive.
Each token describes one or many item.

Example:

```
# this is valid
PA_1299 LA_18 # MARS_19 is not in the list
```

## LOCATION
A text value, usually a single word or symbol that describes uniquely the *location* part

Example: ```GRTI```

## ORDER
A value the describes a single *order* or a contiguous range of *orders* (lower and upper bounds are separated by a comma).
The bounds are included in the range

Exemple: 
```12``` 

```43,53``` the items with order from 43 to 53 included


## Tokens
There are 2 types of tokens

### Tokens with **LOCATION** part
They define the *location* part of the item
the token is build using a **LOCATION**, and an optional **ORDER**.
If present the *order* part is preceded by an underscore ```_```

  - token with *order* part
    defines the *location* of the item and sets the **implicit location** to its location, and the **implicit mode*** to *add*
example:
```TK_28 HK_04,10```

  - token with no *order* part
   describes all items in a location, and sets the **implicit location** to its location and the **
implicit mode** to *remove*.
example:
```DIJ # all items in DIJ``` 

### Tokens with **ORDER** part
They define the *order* part of the item

They can be part of a token with location or be a token on their own.
If the token has no **LOCATION** part, the **implicit location** and  **implicit mode** are used to resolve
the location and if the item is to be added or removed from the list

## implicit location and implicit mode
The implicit location decides what LOCATION an **ORDER** only token is attributed to.
The implicit location is reset to itself by any of the explicit LOCATION tokens 
exemple:
```
FTBL_17
20,22 # means # FTBL_20 FTBL_21 FTBL_22
AMS_12
18    # means # AMS_18
```

The implicit mode decides if the item described must be added or removed from the 
*implicit location*

Exemple:
```
ROM_03         # add ROM_03 to the list, sets ROM as the implicit location and ADD implicit mode
19 27,29       # adds ROM_19 ROM_27 ROM_28 ROM_29 to the list
DIJ            # adds DIJ_01 DIJ_02 DIJ_03 DIJ_04 DIJ_05 DIJ_06
04             # removes DIJ_04
````
The same data with the standard explicit item list is
```
ROM_03
ROM_19
ROM_27
ROM_28
ROM_29
DIJ_01
DIJ_02
DIJ_03
DIJ_05
DIJ_06
```
(and this *flat* list is a valid FlashFile !

### issue with implicit mode
This mode allow for very short encoding of "all" items in a location but the concept of "all" 
is a moving target, as the number of referenced items might increase.

This means the token describes a situation at a moment in time and that the number of items in the location must be known at the time.
If the number of items is likely to vary the use of **LOCATION** only tokens is discouraged.


# application to FlashInvaders lists

This format allows for very concise description of mosaics flashed in the world, because of the possibility
to describe missing items from an otherwise complete location and series of contiguous order, with also the implicit
mode saving lots of space.

The compression ratio is vey high compared to a "flat" list of every item

Paris is under constant *invasion* and the total number of referenced mosaics increases very often so the use of single PA token is not recommended at all.

As the mosaics are in the street and are often destroyed or not flashable, these *all* token should be used with caution.

Invader usually proceeds in "waves", when various (sometimes large) amounts of mosaics a
re added to an already invaded location, this makes location only tokens not suitable for these.

It happens that LIL (Lille) is the only invaded location in the world to have its order number start at 0 instead of 1.
An application will need to take care of this to resolve correctly LIL as LIL_00,05

- Order format is specific to Invader , order numbers < 10 have a  leading "0", as in NOO_01

- FlashFiles describe a list with no linked date, it is up to the application using it to manage the date references as well the meaning for "all but" wrt the number of mosaïcs

- It is possible to encode any value in the comments but it is left to the application to interpret them.  It may be part of a future version of this specification to define a standard for values in comments, in the form of
```
# Date=xxxxx
# player=anonymous
```
    

#  usage

FlashFiles are optimized for FlashInvaders but can be used for any Location Order application.

The format is still very readable while beeing so concise.
Any list in the form of complete location is a valid FlashFile

It can be encoded in a QRCode as an URL and shared or sent in mails or messages.

# implementation

The format is very simple to parse, as it is separator based with a limited number of tokens and states.
A sample implementation is given in Javascript with a decoding tool.

The only difficulty is dealing with single **LOCATION** tokens, in the sample implementation there is a description of the number of mosaics per city, it is only needed to resolve single location tokens and make a general cas of LIL_00 by introducing a start attribute

The other only ;-) difficulty is dealing with LIL starting number.
To get rid of these issues, just do not use single location tokens.

A sample file for flashed mosaics from the Invader universe is provided in flashfile (1244 bytes)
and flat (16943 bytes)
This describes 2348  mosaics in 46 cities and is the flaslist of one of the top 250 players




