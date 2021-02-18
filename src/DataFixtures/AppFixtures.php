<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    protected Generator $faker;

    public function __construct(protected UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager): void
    {
        $adminUser = new User();
        $adminUser
            ->setFirstName('Admin')
            ->setLastName('User')
            ->setEmail('admin@sf.com')
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($this->passwordEncoder->encodePassword($adminUser, 'password'));

        for ($u = 0; $u < 10; $u++) {
            $chrono = 1;
            $user = new User();
            $user
                ->setFirstName($this->faker->firstName)
                ->setLastName($this->faker->lastName)
                ->setEmail($this->faker->email)
                ->setPassword($this->passwordEncoder->encodePassword($user, 'password'));
            $manager->persist($user);

            for ($c = 0; $c < random_int(3, 10); $c++) {
                $customer = new Customer();
                $customer
                    ->setFirstName($this->faker->firstName)
                    ->setLastName($this->faker->lastName)
                    ->setCompany($this->faker->company)
                    ->setEmail($this->faker->companyEmail)
                    ->setOwner($user);
                $manager->persist($customer);

                for ($i = 0; $i < random_int(3, 10); $i++) {
                    $invoice = new Invoice();
                    $invoice
                        ->setAmount($this->faker->randomFloat(2, 250, 5000))
                        ->setSentAt($this->faker->dateTimeBetween('-6 months'))
                        ->setStatus(
                            $this->faker->randomElement(
                                [
                                    Invoice::STATUS_SENT,
                                    Invoice::STATUS_PAID,
                                    Invoice::STATUS_CANCELED
                                ]
                            )
                        )
                        ->setChrono($chrono)
                        ->setCustomer($customer);
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
