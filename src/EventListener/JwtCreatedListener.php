<?php

declare(strict_types=1);

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedListener
{
    public function updateJwtData(JWTCreatedEvent $event): void
    {
        $data = [
            'firstName' => $event->getUser()->getFirstName(),
            'lastName' => $event->getUser()->getLastName()
        ];
        $event->setData(array_merge($event->getData(), $data));
    }
}
